import React from "react";

export interface Props {
  items: any[];
  renderItem: any;
  onChange: (e: any) => void;
  maxDepth: number;
}

declare const Nestable: React.SFC<Props>;

export default Nestable;
