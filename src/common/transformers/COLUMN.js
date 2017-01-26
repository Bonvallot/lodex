export default (destinationColumn, sourceColumn) => doc =>
new Promise((resolve, reject) => {
    try {
        resolve({
            [destinationColumn]: doc[sourceColumn],
        });
    } catch (error) {
        reject(error);
    }
});
