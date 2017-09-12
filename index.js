var imaps = require('imap-simple');

console.log('Start app...');


// Setup imap config
var config = {
    imap: {
        user: 'user@mail.de',
        password: 'test123',
        host: 'host.mail.de',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

console.log('connect...');
imaps.connect(config).then((connection) => {
    console.log('open inbox...');
    return connection.openBox('INBOX').then(() => {
        var searchCriteria = [
            'ALL'//, 'UNSEEN'
        ];

        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        return connection.search(searchCriteria, fetchOptions).then((results) => {
            var subjects = results.map(function(res) {
                return res.parts.filter(function(part) {
                    return part.which === 'HEADER';
                })[0].body.subject[0];
            });

            // LOG Subjects
            console.log('Subjects: ');
            console.log(subjects);
            
            var texts = results.map(function(res) {
                return res.parts.filter(function(part) {
                    return part.which === 'TEXT';
                })[0].body;
            });
            
            // LOG Texts
            console.log('Texts: ');
            console.log(texts);
            
            connection.end();
            
        });
    });
});