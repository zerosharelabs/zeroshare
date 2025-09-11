import Heading2 from "./typography/Heading2";
import HeadingDescription from "./typography/HeadingDescription";
import HeadingTag from "./typography/HeadingTag";

export default function PrivacyByDefault() {
  return (
    <div
      className={
        "bg-neutral-900/20 py-20 border-y border-neutral-900 anchor px-4"
      }
      id="privacy-first"
    >
      <div className={"max-w-3xl mx-auto relative"}>
        <HeadingTag className="text-indigo-300">Privacy-First</HeadingTag>
        <Heading2>{`We Can't See Your Data & We Don't Want To`}</Heading2>
        <HeadingDescription>
          Unlike services that promise not to look at your data, {"we've"} made
          it technically impossible for us to access anything sensitive - all
          encryption happens in your browser, keys stay in the URL fragment that
          never reaches our servers, we keep no logs or metadata, and the only
          thing we store is encrypted data {"that's"} meaningless without the
          keys you control.
        </HeadingDescription>
        <HeadingDescription className="font-medium italic text-xl text-white">
          We believe privacy is a fundamental human right and we do our best to
          protect it.
        </HeadingDescription>
      </div>
    </div>
  );
}
