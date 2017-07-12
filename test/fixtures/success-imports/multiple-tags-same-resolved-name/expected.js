import _svgContents from "..\\..\\..\\..\\some-path\\foo.svg";
<div>
  <Icon svgName="foo" svgContents={_svgContents} />
  <Icon svgName="unnecessary/../foo" svgContents={_svgContents} />
</div>;