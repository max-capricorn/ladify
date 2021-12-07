import { message } from 'antd';

export default class LadifyService {
  static async getcode(pageId) {
    const url = `http://localhost:8081/script?pageId=${pageId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      });
      const content = await response.text();
      message.success('获取脚本成功');
      return content;
    } catch (e) {
      message.error(`获取脚本失败${e}`);
    }
  }

  static async saveCode(scriptContent, pageId) {
    await this.save();
    const url = `http://localhost:8081/script?pageId=${pageId}`;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ d: scriptContent }),
      });
      message.success('保存脚本成功,reload 后生效');
    } catch (e) {
      message.error(`保存脚本失败${e}`);
    }
  }

  static async saveLayout(layoutJson, pageId) {
    // 过滤没用到的旧数据
    // layoutJson.widgets = layoutJson.widgets.map(w=>{return {
    //   i:w.i,
    //   type: w.type
    // }});
    const url = `http://localhost:8081/saveLayout?pageId=${pageId}`;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(layoutJson),
      });
      message.success('保存布局成功');
    } catch (e) {
      message.error(`保存布局失败${e}`);
    }
  }
}
