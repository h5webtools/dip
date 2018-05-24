/**
 * jfet配置
 */

const pkg = require('./package.json');

module.exports = {
  doc() {
    return {
      name: pkg.name,
      title: '数据接口平台文档',
      desc: '数据接口平台的使用介绍，包含创建/编辑接口，Mock，分组，权限等内容。',
      token: '21232F297A57A5A743894A0E4A801FC3',
      uploadUrl: 'http://doc.fe.jyb.com/api/upload'
    };
  }
};
