import React, { FormEventHandler } from 'react';
import CenteredInput from './CenteredInput';

interface FormProps {
  numColumns: number;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

function Form({ numColumns, handleSubmit }: FormProps): JSX.Element {
  return (
    <form onSubmit={handleSubmit}>
    <div className="flex flex-col items-center gap-4">
      <CenteredInput name="goal" placeholder="Goal" />
      <div className="flex justify-center gap-4">
        {Array.from({ length: numColumns }).map((_, index) => (
          <CenteredInput key={index} name={`input${index}`} placeholder={`${index + 1}`} />
        ))}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Submit</button>
      </div>
    </div>
    </form>
  );
}

export default Form;