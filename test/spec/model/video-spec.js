(function() {
    describe('Video', function() {

        describe('#constructor(XML)', function(){
            it('should parse valid XML Plex data', function() {

                var parser = new DOMParser();
                var doc = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><Video ratingKey="1" key="/library/metadata/1" guid="com.plexapp.agents.imdb://tt0116922?lang=en" studio="October Films" type="movie" title="Lost Highway" contentRating="R" summary="summary" rating="8.6000003814697301" year="1997" thumb="/library/metadata/1/thumb?t=1355992507" art="/library/metadata/1/art?t=1355992507" duration="8040000" originallyAvailableAt="1997-01-15" addedAt="1355992484" updatedAt="1355992507"><Media id="1" container=""><Part key="/library/parts/1/file.mkv" file="/Users/jhn/Movies/Lost Highway.mkv" size="5" /></Media><Genre id="20" tag="Thriller" /><Genre id="21" tag="Indie" /><Genre id="22" tag="Mystery" /><Genre id="23" tag="Crime Thriller" /><Genre id="24" tag="Neo-noir" /><Genre id="25" tag="Horror" /><Genre id="26" tag="Surrealism" /><Genre id="27" tag="Drama" /><Genre id="28" tag="Psychological thriller" /><Writer id="2" tag="David Lynch" /><Writer id="3" tag="Barry Gifford" /><Director id="1" tag="David Lynch" /><Country id="29" tag="France" /><Role id="4" tag="Michael Massee" role="Andy" /><Role id="5" tag="Robert Loggia" role="Dick Laurent" /><Role id="6" tag="Natasha Gregson Wagner" role="Sheila" /><Role id="7" tag="Marilyn Manson" role="" /><Role id="8" tag="Richard Pryor" role="Arnie" /><Role id="9" tag="Jack Kehler" role="Guard Johnny Mack" /><Role id="10" tag="Giovanni Ribisi" role="Steve &apos;V&apos;" /><Role id="11" tag="Scott Coffey" role="Teddy" /><Role id="12" tag="Gary Busey" role="Bill Dayton" /><Role id="13" tag="Jack Nance" role="Phil" /><Role id="14" tag="Henry Rollins" role="Guard Henry" /><Role id="15" tag="Lucy Butler" role="Candace Dayton" /><Role id="16" tag="Patricia Arquette" role="Alice Wakefield" /><Role id="17" tag="Bill Pullman" role="Fred Madison" /><Role id="16" tag="Patricia Arquette" role="Renee Madison" /><Role id="18" tag="Balthazar Getty" role="Pete Dayton" /><Role id="19" tag="Robert Blake" role="Mystery Man" /></Video>', 'application/xml');
                var video = new Video(doc.firstChild);

                expect(video.title).to.equal('Lost Highway');
            });
        });
    });
})();