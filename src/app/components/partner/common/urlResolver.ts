import { ActiveUrls } from './../../../auth/activeUrls';

export class UrlResolver {
  
  //TODO refactor
  public static prepareChatUrl(url: string, partUrl: string): string {
    const index = UrlResolver.getPosition(url, '/', 3);
    return url.substring(0, index) + partUrl;
  }

  private static getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  public static getMainSectionFromUrl(url: string): string {
    let urlPart = url;
    urlPart = urlPart.substring(urlPart.indexOf('/', 1) + 1);
    if(urlPart.indexOf('/') != -1) {
      urlPart = urlPart.substring(urlPart.indexOf('/') + 1);
      if(urlPart.indexOf('/') != -1) {
        urlPart = urlPart.substring(0, urlPart.indexOf('/'));
      }
    }

    return urlPart;
  }

  //public static parseUrl(url: string)
}