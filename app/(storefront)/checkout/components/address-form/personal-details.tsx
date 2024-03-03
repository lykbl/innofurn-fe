import TextInput from '@/(storefront)/checkout/components/address-form/text-input';
import { MouseEventHandler, useState } from 'react';
import { Button } from '@/components/ui/common/button';

const PersonalDetails = () => {
  const [companyMode, setCompanyMode] = useState(false);

  const toggleCompanyMode: MouseEventHandler = (e) => {
    setCompanyMode((prev) => !prev);
  };

  if (companyMode) {
    return (
      <div className="flex items-end gap-2">
        <TextInput
          label="Company Name"
          handle="companyName"
          className="w-1/3"
        />
        <Button variant="ghost" type="button" onClick={toggleCompanyMode}>
          Ordering for yourself?
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex w-1/3 gap-2">
        <TextInput label="First Name" handle="firstName" />
        <TextInput label="Last Name" handle="lastName" />
      </div>
      <Button variant="ghost" type="button" onClick={toggleCompanyMode}>
        Ordering for a company?
      </Button>
    </div>
  );
};

export default PersonalDetails;
