import Head from 'next/head';

function Image({ svgContents, svgName, ...props }) {
  return React.cloneElement(svgContents, props);
}

export default () => (
  <div>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
    </Head>

    <Image svgName='nextjs-logo' width='112' height='72' alt='next.js' />

    <style jsx global>{`
      html, body {
        height: 100%
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
      }
    `}</style>
  </div>
)
