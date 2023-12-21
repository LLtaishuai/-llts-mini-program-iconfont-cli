import path from 'path';
import fs from 'fs';
import colors from 'colors';
import defaultConfig from './iconfont.json';
import minimist from 'minimist';

export interface IOption {
  url: string,
  trim_icon_prefix: string;
}

export interface Config {
  symbol_options: IOption[];
  save_dir: string;
  use_rpx: boolean;
  default_icon_size: number;
}

let cacheConfig: Config;

export const getConfig = () => {
  if (cacheConfig) {
    return cacheConfig;
  }


  const args = minimist<{ config: string }>(process.argv.slice(2));
  let configFilePath = 'iconfont.json';

  if (args.config && typeof args.config === 'string') {
    configFilePath = args.config;
  }

  const targetFile = path.resolve(configFilePath);

  if (!fs.existsSync(targetFile)) {
    console.warn(colors.red(`File "${configFilePath}" doesn't exist, did you forget to generate it?`));
    process.exit(1);
  }

  const config = require(targetFile) as Config;

  if (!Array.isArray(config.symbol_options) || !config.symbol_options.length || config.symbol_options.some(option => !/^(https?:)?\/\//.test(option.url))) {
    console.warn(colors.red('You are required to provide symbol_url'));
    process.exit(1);
  }
  config.symbol_options = config.symbol_options.map(option => option.url.indexOf('//') === 0 ? {...option, url: `http:${option.url}`} : option)
  config.save_dir = config.save_dir || defaultConfig.save_dir;
  config.default_icon_size = config.default_icon_size || defaultConfig.default_icon_size;

  cacheConfig = config;

  return config;
};
