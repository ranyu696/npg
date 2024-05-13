import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Video {
  poster2: Poster;
  count: number;
  tags: string[];
  _id: string;
  originalname: string;
  createAt: string;
  category: string;
  duration: string;
  poster: string;
  previewvideo: string;
  enOriginalName: string;
  rate: number;
  tcOriginalName: string;
  year: number;
  categoryObj: CategoryObj;
  tagsObj: TagObj[];
};

export interface Poster {
  url: string;
  height: number;
  width: number;
};

export interface CategoryObj {
  hidden: boolean;
  _id: string;
  title: string;
  image: string;
  createAt: string;
  __v: number;
};

export interface TagObj {
  counts: number;
  _id: string;
  tag: string;
  createAt: string;
  __v: number;
};
export interface VideosByCategory {
  [category: string]: Video[];
}
