#!/usr/bin/env node

import colors from 'colors';
import { getConfig } from '../libs/getConfig';
import { fetchXml } from '../libs/fetchXml';
import { generateWechatComponent } from '../libs/generateWechatComponent';
import { generateAlipayComponent } from '../libs/generateAlipayComponent';
import { generateKuaishouComponent } from '../libs/generateKuaishouComponent';
import { generateBaiduComponent } from '../libs/generateBaiduComponent';
import { generateQqComponent } from '../libs/generateQqComponent';
import { generateToutiaoComponent } from '../libs/generateToutiaoComponent';

import minimist from 'minimist';

const args = minimist<{ model: string }>(process.argv.slice(2));

let model = 'wechat'

if (args.model && typeof args.model === 'string') {
  model = args.model;
}

const config = getConfig();

Promise.all(config.symbol_options.map(option => fetchXml(option.url, option.trim_icon_prefix))).then((result) => {
  switch(model) {
    case 'wechat':
      generateWechatComponent(result, config);
      break;
    case 'alipay':
      generateAlipayComponent(result, config);
      break;
    case 'kuaishou':
      generateKuaishouComponent(result, config);
      break;
    case 'baidu':
      generateBaiduComponent(result, config);
      break;
    case 'qq':
      generateQqComponent(result, config);
      break;
    case 'toutiao':
      generateToutiaoComponent(result, config);
      break;
  }
  
}).catch((e) => {
  console.error(colors.red(e.message || 'Unknown Error'));
  process.exit(1);
});
