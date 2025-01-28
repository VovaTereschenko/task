const handleFakeRequest = async ({
  onSuccess,
  onFail,
  setLoading,
}: {
  onSuccess: () => void;
  onFail: () => void;
  setLoading: () => void;
}) => {
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  setLoading();

  const num = new Promise((res) => {
    setTimeout(() => {
      const randomNumber = getRandomInt(2);
      res(randomNumber);
    }, 1000);
  });

  num.then((res) => (res === 1 ? onSuccess() : onFail()));
};

export { handleFakeRequest };
