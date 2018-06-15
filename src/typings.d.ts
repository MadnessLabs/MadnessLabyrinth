import '../interfaces/global';

declare global {

  interface IYoutubeIframe extends HTMLAttributes {
    allow?: string;
    allowfullscreen?: boolean;
  }

  namespace JSXElements {
    export interface IframeHTMLAttributes extends IYoutubeIframe { }
  }
}