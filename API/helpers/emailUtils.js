const nodemailer = require('nodemailer');
const pug = require('pug');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

function generateHTML(name, permsList) {
  return pug.renderFile('fixtures/messageTemplate.pug', {
    name: name,
    permsList: permsList
  });
}

const basicOpts = {
  from: config.root.email,
  subject: 'Información Ejeturismo'
};

const mailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.root.email,
    pass: config.root.emailPass
  }
});

module.exports = {
  mailer,
  notifyPermissions: (userObject, callback) => {
    const mailOpts = Object.assign(basicOpts, {
      to: userObject.email,
      html: generateHTML(
        `${userObject.firstName} ${userObject.lastName}`,
        userObject.adminPermission.acceptedChannels
      )
    });

    mailer.sendMail(mailOpts, callback);
  }
};

// mailer.mailer.sendMail(mailOpts, function(error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Message sent: ' + info.response);
//   }
// });
