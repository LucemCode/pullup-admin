let snapshotToArray = (snapshot) => {
    let a = [];
    snapshot.forEach(function(childSnapshot) {
        let b = childSnapshot.val();
        b.key = childSnapshot.key;
        a.push(b);
    });
    return a;
};

export default snapshotToArray;