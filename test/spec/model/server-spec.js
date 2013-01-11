(function() {
    describe('Server', function() {

        describe('#constructor(XML)', function(){
            it('should parse valid XML Plex data', function() {

                var parser = new DOMParser();
                var doc = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><Server accessToken="zG7EVZiD78Mn87pWz3vv" name="MacBook PMS" address="90.184.158.218" port="20826" version="0.9.7.9.375-d056f10" host="90.184.158.218" localAddresses="10.0.0.30" machineIdentifier="b776464c582ea61be9776dd28bb6beb3a1c9d56f" createdAt="1351660975" updatedAt="1357767622" owned="1"/>', 'application/xml');
                var server = new Server(doc.firstChild);

                expect(server.name).to.equal('MacBook PMS');
                expect(server.host).to.equal('90.184.158.218');
                expect(server.port).to.equal('20826');
            });
        });
    });
    describe('Servers', function() {

        describe('#constructor(XML)', function(){
            it('should parse valid XML Plex data', function() {

                var parser = new DOMParser();
                var doc = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><MediaContainer friendlyName="myPlex" identifier="com.plexapp.plugins.myplex" machineIdentifier="56c3db2f5e6b58d6e9611c44666ec2073278d3e2" size="1">  <Server accessToken="zG7EVZiD78Mn87pWz3vv" name="MacBook PMS" address="90.184.158.218" port="20826" version="0.9.7.9.375-d056f10" host="90.184.158.218" localAddresses="10.0.0.30" machineIdentifier="b776464c582ea61be9776dd28bb6beb3a1c9d56f" createdAt="1351660975" updatedAt="1357767622" owned="1"/></MediaContainer>', 'application/xml');
                var servers = new Servers(doc.firstChild);

                expect(servers.servers.length).to.equal(1);
            });
        });
    });
})();
