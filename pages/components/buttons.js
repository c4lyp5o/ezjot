const ClearButton = (props) => {
  const { onClick } = props;
  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={() => onClick()}
    >
      Clear
    </button>
  );
};

const SaveButton = () => {
  return (
    <button
      className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
      type="submit"
    >
      Save
    </button>
  );
};

const SaveEditButton = (props) => {
  const { onClick } = props;
  return (
    <button
      className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={() => onClick()}
    >
      Save
    </button>
  );
};

const GetButton = () => {
  return (
    <button
      className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
      type="submit"
    >
      Get
    </button>
  );
};

export { ClearButton, SaveButton, SaveEditButton, GetButton };
