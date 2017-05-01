export default function* execIterator(regExp, string) {
  const localRegExp = new RegExp(regExp.source, 'g');
  let execResult;

  do {
    execResult = localRegExp.exec(string);
    if (execResult !== null) {
      yield execResult;
    }
  } while (execResult !== null);
}
