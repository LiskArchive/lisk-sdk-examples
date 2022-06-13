import { FunctionComponent, SVGProps } from 'react';

export type MenuItem = {
  iconComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
  route: string;
};
