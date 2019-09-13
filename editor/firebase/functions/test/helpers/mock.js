module.exports = ctx => {

  // if(ctx.mockConfig.mailgun.mock) {
  //   ctx.app.services.mailgun._send = async ({ to }, { from, subject, html }) => {
  //     let data = {
  //       type: 'email',
  //       from,
  //       to,
  //       subject,
  //       html
  //     };
  //     await ctx.admin.firestore.collection('-events').doc().set(data);
  //   }
  // }

};
