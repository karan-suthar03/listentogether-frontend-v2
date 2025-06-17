import {Loader2} from 'lucide-react';

type LoadingSpinnerProps = {
    message?: string;
};

const LoadingSpinner = ({message = 'Loading...'}: LoadingSpinnerProps) => {
    return (
        <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
            <div
                className="bg-gray-900/90 p-8 rounded-xl backdrop-blur-xl shadow-2xl border border-white/10 ring-1 ring-white/5">
                <Loader2 className="w-12 h-12 animate-spin text-green-400 mx-auto mb-4"/>
                <p className="text-gray-300 font-medium text-center">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
