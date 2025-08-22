type Option<T extends string> = {
  label: string;
  value: T;
};

export default function SegmentedControl<T extends string>({
  label,
  options,
  defaultIndex,
}: {
  label: string;
  options: readonly Option<T>[];
  defaultIndex: number;
}) {
  return (
    <fieldset className="space-y-2">
      <legend>{label}</legend>
      <div className="flex gap-1">
        {options.map((option, idx) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={`${label}-choice`}
              value={option.value}
              defaultChecked={idx === defaultIndex}
              className="peer hidden"
              required
            />
            <span
              className="
                px-4 py-2 bg-gray-200 text-gray-700 
                transition-all duration-200 ease-in-out
                peer-checked:bg-blue-400 peer-checked:text-white
                hover:bg-gray-300 peer-checked:hover:bg-blue-700
                peer-checked:scale-105
              "
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
