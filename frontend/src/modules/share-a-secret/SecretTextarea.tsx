import Textarea from "@/components/common/Textarea";

type SecretTextareaProps = {
  data: string;
  loading: boolean;
  setData: (data: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export default function SecretTextarea({
  data,
  loading,
  setData,
  textareaRef,
}: SecretTextareaProps) {
  return (
    <div className="bg-neutral-925 w-full flex flex-col items-center justify-between">
      <div className="w-full relative flex flex-col-reverse">
        <Textarea
          placeholder="Type your confidential message here. It will be encrypted and will self-destruct after being viewed..."
          value={data}
          autoFocus
          cols={30}
          disabled={loading}
          rows={4}
          onChange={(event) => setData(event.currentTarget.value)}
          ref={textareaRef}
        />
      </div>
    </div>
  );
}
