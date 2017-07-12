import _svgContents from "..\\..\\..\\..\\some-path\\foo.svg";
function Foo() {
  return () => [<Icon svgName="foo" svgContents={_svgContents} />];
}