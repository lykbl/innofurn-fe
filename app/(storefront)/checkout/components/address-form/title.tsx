import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/common/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/common/input';
import { MouseEventHandler, useCallback, useState } from 'react';
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

const TitleInput = () => {
  const [titleEditMode, setTitleEditMode] = useState(false);
  const { control } = useFormContext();
  const inputRef = useCallback((input: HTMLInputElement) => {
    input?.focus();
  }, []);

  const toggleTitleEditMode: MouseEventHandler = (e) => {
    e.preventDefault();
    setTitleEditMode((prev) => !prev);
  };

  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            {titleEditMode ? (
              <EditMode
                inputRef={inputRef}
                field={field}
                toggleTitleEditMode={toggleTitleEditMode}
              />
            ) : (
              <PreviewMode toggleTitleEditMode={toggleTitleEditMode} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const PreviewMode = ({
  toggleTitleEditMode,
}: {
  toggleTitleEditMode: MouseEventHandler;
}) => {
  const { title } = useFormContext().getValues();

  return (
    <h1>
      <Button
        variant="ghost"
        className="border-none px-0 text-2xl font-normal"
        onClick={toggleTitleEditMode}
      >
        {title}
      </Button>
    </h1>
  );
};

const EditMode = ({
  toggleTitleEditMode,
  field,
  inputRef,
}: {
  toggleTitleEditMode: MouseEventHandler;
  field: ControllerRenderProps<FieldValues, 'title'>;
  inputRef: (input: HTMLInputElement) => void;
}) => {
  return (
    <div className="flex gap-2">
      <Input {...field} ref={inputRef} className="border-none px-0 text-2xl" />
      <Button variant="default" onClick={toggleTitleEditMode}>
        Save
      </Button>
    </div>
  );
};

export default TitleInput;
