import React from 'react';

interface GoalProps {
  isEditable: boolean;
  value: number | null;
  onGoalChange: (value: number | null) => void;
}

function Goal({ isEditable=true, value, onGoalChange }:GoalProps): React.JSX.Element {

  const basestyle = "flex items-center justify-center h-16 w-36 ";
  const style = isEditable ? `${basestyle}` : basestyle; 
  
  return (
    <div className={style}>
      <input className="text-center text-4xl w-32 bg-transparent border-none focus:ring-0 focus:outline-none" 
             readOnly={!isEditable} 
             value={value === null ? "" : value}
             type="number"
             onChange={event => onGoalChange(event.target.valueAsNumber)}>
        </input>
    </div>
  );
}

export default Goal;
