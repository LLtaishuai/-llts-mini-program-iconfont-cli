import axios from 'axios';
import { parseString } from 'xml2js';
import colors from 'colors';

export interface XmlData {
  svg: {
    symbol: Array<{
      $: {
        viewBox: string;
        id: string;
      };
      path: Array<{
        $: {
          d: string;
          fill?: string;
        };
      }>;
    }>;
  }
}

export const fetchXml = async (url, trim_icon_prefix: string, prefix: string): Promise<{result:XmlData, trim_icon_prefix: string, prefix: string}> => {
  console.log('Fetching iconfont data...');

  try {
    const { data } = await axios.get<string>(url);
    const matches = String(data).match(/'<svg>(.+?)<\/svg>'/);

    if (matches) {
      return new Promise<{result:XmlData, trim_icon_prefix: string, prefix: string}>((resolve, reject) => {
        parseString(`<svg>${matches[1]}</svg>`, { rootName: 'svg' },  (err: Error, result: XmlData) => {
          if (err) {
            reject(err);
          } else {
            resolve({result, trim_icon_prefix, prefix});
          }
        });
      });
    }

    throw new Error('You provide a wrong symbol url');
  } catch (e: any) {
    console.error(colors.red(e.message || 'Unknown Error'));
    process.exit(1);
    throw e;
  }
};
