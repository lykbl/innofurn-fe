import { MouseEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import TextInput from '@/(storefront)/checkout/components/address-form/text-input';

const maxLines = 3;

const AddressLines = () => {
  const [linesCount, setLinesCount] = useState(1);

  const handleAddLine: MouseEventHandler = (e) => {
    e.preventDefault();
    if (linesCount < maxLines) {
      setLinesCount((prev) => prev + 1);
    }
  };

  const handleRemoveLine: MouseEventHandler = (e) => {
    e.preventDefault();
    if (linesCount > 1) {
      setLinesCount((prev) => prev - 1);
    }
  };

  const countToProps = (
    lineNumber: number,
  ): { label: string; handle: 'lineOne' | 'lineTwo' | 'lineThree' } => {
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
          <div className="flex items-end gap-2">
            <TextInput {...countToProps(i)} />
            <LineButton
              lineNumber={i}
              linesCount={linesCount}
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
  handleAddLine,
  handleRemoveLine,
}: {
  lineNumber: number;
  linesCount: number;
  handleAddLine: MouseEventHandler;
  handleRemoveLine: MouseEventHandler;
}) => {
  if (lineNumber === linesCount && lineNumber < maxLines) {
    return (
      <Button onClick={handleAddLine}>
        <Icons.plus />
      </Button>
    );
  }

  return (
    <Button onClick={handleRemoveLine}>
      <Icons.x />
    </Button>
  );
};

export default AddressLines;
