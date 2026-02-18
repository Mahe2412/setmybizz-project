import React from 'react';

const StepPlaceholder: React.FC<any> = (props) => {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Step Placeholder</h2>
            <p className="mb-4">This step content needs to be provided.</p>
            <div className="flex gap-4 justify-center">
                {props.onBack && <button onClick={props.onBack} className="px-4 py-2 border rounded">Back</button>}
                {props.onNext && <button onClick={props.onNext} className="px-4 py-2 bg-primary text-white rounded">Next</button>}
                {props.onLogin && <button onClick={props.onLogin} className="px-4 py-2 bg-primary text-white rounded">Login</button>}
            </div>
        </div>
    );
};
export default StepPlaceholder;
