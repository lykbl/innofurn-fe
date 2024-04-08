import { MouseEventHandler, useState } from 'react';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import TextInput from '@/components/address/address-form/text-input';
import { useFormContext } from 'react-hook-form';
import { AddressFormSchema } from '@/components/address/address-form/form';
import { z } from 'zod';

const maxLines = 3;

type AddressLineHandles = keyof Pick<
  z.infer<typeof AddressFormSchema>,
  'lineOne' | 'lineTwo' | 'lineThree'
>;

const AddressLines = () => {
  const [linesCount, setLinesCount] = useState(1);
  const { setValue } = useFormContext();

  const handleAddLine: MouseEventHandler = () => {
    if (linesCount < maxLines) {
      setLinesCount((prev) => prev + 1);
    }
  };

  const handleRemoveLine = () => {
    if (linesCount > 1) {
      setLinesCount((prev) => {
        const newCount = prev - 1;
        setValue(countToProps(prev).handle, '');

        return newCount;
      });
    }
  };

  const countToProps = (
    lineNumber: number,
  ): {
    label: string;
    handle: AddressLineHandles;
  } => {
    switch (lineNumber) {
      default:
        return { label: 'Line One', handle: 'lineOne' };
      case 2:
        return { label: 'Line Two', handle: 'lineTwo' };
      case 3:
        return { label: 'Line Three', handle: 'lineThree' };
    }
  };

  return (
    <div className="flex justify-between gap-2">
      <div className="flex w-full flex-col gap-2">
        {Array.from({ length: linesCount }, (_, i) => i + 1).map((i) => (
          <div key={i} className="flex items-end gap-2">
            <TextInput {...countToProps(i)} />
            <LineButton
              lineNumber={i}
              linesCount={linesCount}
              inputHandle={countToProps(i).handle}
              handleAddLine={handleAddLine}
              handleRemoveLine={handleRemoveLine}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const LineButton = ({
  lineNumber,
  linesCount,
  inputHandle,
  handleAddLine,
  handleRemoveLine,
}: {
  lineNumber: number;
  linesCount: number;
  inputHandle: AddressLineHandles;
  handleAddLine: MouseEventHandler;
  handleRemoveLine: (inputHandle: AddressLineHandles) => void;
}) => {
  if (lineNumber === linesCount && lineNumber < maxLines) {
    return (
      <Button type="button" onClick={handleAddLine}>
        <Icons.plus />
      </Button>
    );
  }

  return (
    //TODO rework this
    <Button type="button" onClick={() => handleRemoveLine(inputHandle)}>
      <Icons.x />
    </Button>
  );
};

export default AddressLines;
