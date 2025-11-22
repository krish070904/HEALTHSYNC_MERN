export const SubmitCard = ({ loading, onSubmit }) => {
return (
<div className="mt-8">
<button
disabled={loading}
onClick={onSubmit}
className={`w-full bg-saffron-darker text-gray-900 font-bold py-3.5 px-6 rounded-lg text-lg hover:bg-saffron focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron dark:focus:ring-offset-background-dark transition-all active:scale-[0.98] shadow-lg shadow-saffron/30 ${loading ? "opacity-60" : ""}`}
>
{loading ? "Saving..." : "Save Today’s Check-In"}
</button>
</div>
);
};