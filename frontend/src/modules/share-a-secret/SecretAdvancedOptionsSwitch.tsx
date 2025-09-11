import Switch from "@/components/Switch";

type SecretAdvancedOptionsSwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function SecretAdvancedOptionsSwitch({
  value,
  onChange,
}: SecretAdvancedOptionsSwitchProps) {
  return (
    <div className="w-full">
      <Switch
        value={value}
        onChange={(toggle) => {
          onChange(toggle);
        }}
        title="Advanced Options (Recommended)"
        description="Configure additional security settings for your shared link."
      />
    </div>
  );
}
