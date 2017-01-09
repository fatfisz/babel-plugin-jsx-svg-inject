var _iconMarkupFoo = require("/root/some-path/foo.svg"),
    _iconMarkupBar = require("/root/some-path/bar.svg"),
    _iconMarkupBaz = require("/root/some-path/baz.svg");

<div>
  <Icon markup={_iconMarkupFoo} />
  <Icon markup={_iconMarkupFoo} />
  <Icon markup={_iconMarkupBar} />
  <Icon markup={_iconMarkupFoo} />
  <Icon markup={_iconMarkupBaz} />
  <Icon markup={_iconMarkupBar} />
</div>;