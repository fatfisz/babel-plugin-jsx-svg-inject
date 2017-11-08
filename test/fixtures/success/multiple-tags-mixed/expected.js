var _svgContents = <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100" /></svg>;

var _svgContents2 = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" /></svg>;

var _svgContents3 = <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><ellipse cx="60" cy="60" rx="50" ry="25" /></svg>;

<div>
  <Icon svgName="foo" svgContents={_svgContents} />
  <Icon svgName="foo" svgContents={_svgContents} />
  <Icon svgName="bar" svgContents={_svgContents2} />
  <Icon svgName="foo" svgContents={_svgContents} />
  <Icon svgName="baz" svgContents={_svgContents3} />
  <Icon svgName="bar" svgContents={_svgContents2} />
</div>;