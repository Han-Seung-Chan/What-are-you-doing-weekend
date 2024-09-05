export function getTimeDifference(targetDateTime) {
  const differenceInMilliseconds = new Date(targetDateTime) - new Date();

  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);

  const hours = differenceInHours;
  const minutes = differenceInMinutes % 60;

  if (hours - 1 < 0) {
    return `${Math.abs(hours) - 1}시간 ${Math.abs(minutes)}분 전`;
  } else if (minutes < 0) {
    return `${Math.abs(minutes)}분`;
  } else {
    return '';
  }
}
