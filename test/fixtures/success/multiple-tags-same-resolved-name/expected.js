import _svgContentsSomePathFooSvg from "../../../../some-path/foo.svg";
<div>
  <Icon svgName="foo" svgContents={_svgContentsSomePathFooSvg} />
  <Icon svgName="unnecessary/../foo" svgContents={_svgContentsSomePathFooSvg} />
</div>;
