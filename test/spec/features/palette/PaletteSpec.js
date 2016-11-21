'use strict';

/* global bootstrapDiagram, inject, sinon */

var paletteModule = require('../../../../lib/features/palette');

var domQuery = require('min-dom/lib/query'),
    domClasses = require('min-dom/lib/classes');

function Provider(entries) {
  this.getPaletteEntries = function() {
    return entries || {};
  };
}


describe('features/palette', function() {

  describe('bootstrap', function() {

    beforeEach(bootstrapDiagram({
      modules: [ paletteModule ]
    }));


    it('should attach palette to diagram', inject(function(canvas, palette) {

      // when
      palette.registerProvider(new Provider());

      // then
      var container = canvas.getContainer();

      var paletteArray = domQuery.all('.djs-palette', container);

      expect(paletteArray.length).to.equal(1);
    }));


    it('should not attach palette to diagram without provider', inject(function(canvas, palette) {

      var container = canvas.getContainer();

      var paletteArray = domQuery.all('.djs-palette', container);

      expect(paletteArray.length).to.equal(0);
    }));

  });


  describe('providers', function() {

    beforeEach(bootstrapDiagram({
      modules: [ paletteModule ]
    }));


    it('should register provider', inject(function(palette) {

      // given
      var provider = new Provider();

      // when
      palette.registerProvider(provider);

      // then
      expect(palette._providers).to.eql([ provider ]);
    }));


    it('should query provider for entries', inject(function(palette) {

      // given
      var provider = new Provider();

      palette.registerProvider(provider);

      sinon.spy(provider, 'getPaletteEntries');

      // when
      var entries = palette.getEntries();

      // then
      expect(entries).to.eql({});

      // pass over providers
      expect(provider.getPaletteEntries).to.have.been.called;
    }));


    it('should add palette entries', inject(function(canvas, palette) {

      // given
      var entries  = {
        'entryA': {
          alt: 'A',
          className: 'FOO',
          action: function() {
            console.log('click entryA', arguments);
          }
        },
        'entryB': {
          alt: 'B',
          imageUrl: 'http://placehold.it/40x40',
          action: {
            click: function() {
              console.log('click entryB');
            },
            dragstart: function(event) {
              console.log('dragstart entryB');
              event.preventDefault();
            }
          }
        }
      };

      var provider = new Provider(entries);

      // when
      palette.registerProvider(provider);
      palette.open();

      // then data structure should set
      var pEntries = palette.getEntries();
      expect(pEntries.entryA).to.exist;
      expect(pEntries.entryB).to.exist;

      // then DOM should contain entries
      var entryA = domQuery('[data-action="entryA"]', palette._container);
      expect(entryA).to.exist;
      expect(domClasses(entryA).has('FOO')).to.be.true;

      var entryB = domQuery('[data-action="entryB"]', palette._container);
      expect(entryB).to.exist;
      expect(domQuery('img', entryB)).to.exist;
    }));


    describe('entry className', function() {

      function testClassName(options) {

        var set = options.set,
            expected = options.expect;

        return inject(function(palette) {

          // given
          var entries  = {
            'entryA': {
              alt: 'A',
              className: set
            }
          };

          var provider = new Provider(entries);

          // when
          palette.registerProvider(provider);
          palette.open();

          // then DOM should contain entries
          var entryA = domQuery('[data-action="entryA"]', palette._container);
          expect(entryA).to.exist;

          // expect all classes to be set
          expected.forEach(function(cls) {
            expect(domClasses(entryA).has(cls)).to.be.true;
          });
        });
      }


      it('should recognize Array<String> as className', testClassName({
        set: [ 'FOO', 'BAAAR' ],
        expect: [ 'FOO', 'BAAAR' ]
      }));


      it('should recognize <space separated classes> as className', testClassName({
        set: 'FOO BAAAR blub',
        expect: [ 'FOO', 'BAAAR', 'blub' ]
      }));

    });

  });


  describe('lifecycle', function() {

    beforeEach(bootstrapDiagram({
      modules: [ paletteModule ]
    }));

    beforeEach(inject(function(palette) {
      palette.registerProvider(new Provider());
    }));


    it('should be visible', inject(function(canvas, palette) {

      // marker class on .djs-container
      expect(is(canvas._container, 'djsp-visible')).to.be.true;
    }));


    it('should be opened (default)', inject(function(canvas, palette) {

      // then
      expect(palette.isOpen()).to.be.true;

      // marker class on .djs-container
      expect(is(canvas._container, 'djsp-open')).to.be.true;
    }));


    it('should close', inject(function(canvas, palette) {

      // when
      palette.close();

      // then
      expect(palette.isOpen()).to.be.false;

      // no marker class on .djs-container
      expect(is(canvas._container, 'djsp-open')).to.be.false;
    }));


    it('should re-open', inject(function(canvas, palette) {

      // when
      palette.close();
      palette.open();

      // then
      expect(palette.isOpen()).to.be.true;

      // no marker class on .djs-container
      expect(is(canvas._container, 'djsp-open')).to.be.true;
    }));

  });


  describe('column layout', function() {

    var entries = {
      'entryA': {
        action: function() {}
      },
      'entryB': {
        action: function() {}
      },
      'entryC': {
        action: function() {}
      },
      'entryD': {
        action: function() {}
      },
      'entryE': {
        action: function() {}
      }
    };

    beforeEach(bootstrapDiagram({
      modules: [ paletteModule ]
    }));

    beforeEach(inject(function(palette) {

      palette.registerProvider(new Provider(entries));
    }));


    it('should be single column if enough space for entries',
      inject(function(canvas, palette) {
        // given
        var parent = canvas.getContainer();

        parent.style.height = '300px';

        // when
        canvas.resized();

        // then
        expect(is(parent, 'djsp-two-column')).to.be.false;
      })
    );


    it('should collapse into two columns',
      inject(function(canvas, palette) {
        // given
        var parent = canvas.getContainer();

        parent.style.height = '270px';

        // when
        canvas.resized();

        // then
        expect(is(parent, 'djsp-two-column')).to.be.true;
      })
    );


    it('should turn the palette into a one column layout',
      inject(function(canvas, palette) {
        var parent = canvas.getContainer();

        parent.style.height = '270px';

        // when
        canvas.resized();

        parent.style.height = '300px';

        canvas.resized();

        // then
        expect(is(parent, 'djsp-two-column')).to.be.false;
      })
    );

  });

});



///////// helpers /////////////////////

function is(node, cls) {
  return domClasses(node).has(cls);
}
