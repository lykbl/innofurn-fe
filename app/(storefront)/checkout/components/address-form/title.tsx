import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/common/form';
import { Button } from '@/components/ui/common/button';
import { Input } from '@/components/ui/common/input';
import React, { useCallback, useRef, useState } from 'react';
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { useClickAway, useKey } from 'react-use';

const TitleInput = () => {
  const { control, getValues } = useFormContext();
  const { title } = getValues();
  const [titleEditMode, setTitleEditMode] = useState(title === '');
  const inputRef = useCallback((input: HTMLInputElement) => {
    input?.focus();
  }, []);

  const toggleTitleEditMode = () => {
    if (title !== '') {
      setTitleEditMode((prev) => !prev);
    }
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
  toggleTitleEditMode: () => void;
}) => {
  const { title } = useFormContext().getValues();

  return (
    <h1>
      <Button
        variant="ghost"
        type="button"
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
  toggleTitleEditMode: () => void;
  field: ControllerRenderProps<FieldValues, 'title'>;
  inputRef: (input: HTMLInputElement) => void;
}) => {
  const editInputRef = useRef<HTMLDivElement>(null);

  useClickAway(editInputRef, () => {
    toggleTitleEditMode();
  });
  useKey('Escape', toggleTitleEditMode);

  return (
    <div ref={editInputRef} className="flex gap-2">
      <Input {...field} ref={inputRef} className="border-none px-0 text-2xl" />
      <Button variant="default" type="button" onClick={toggleTitleEditMode}>
        Save
      </Button>
    </div>
  );
};

export default TitleInput;
