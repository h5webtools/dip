/**
 * getter
 */

const getters = {
  treeGroups: state => {
    const groups = state.groups;
    // const groups = [
    //   {
    //     _id: 21,
    //     parentId: 2,
    //     name: 'n21'
    //   },
    //   {
    //     _id: 222,
    //     parentId: 11,
    //     name: 'n222'
    //   },
    //   {
    //     _id: 22,
    //     parentId: 1,
    //     name: 'n22'
    //   },
    //   {
    //     _id: 111,
    //     parentId: 11,
    //     name: 'n111'
    //   },
    //   {
    //     _id: 1111,
    //     parentId: 111,
    //     name: 'n1111'
    //   },
    //   {
    //     _id: 11,
    //     parentId: 1,
    //     name: 'n11'
    //   },
    //   {
    //     _id: 1,
    //     name: 'n1.1'
    //   },
    //   {
    //     _id: 2,
    //     name: 'n2'
    //   }
    // ];

    let treeData = [];
    let posArr = []; // 位置数组
    let child = []; // 子分组

    groups.forEach((group) => {
      // 没有父分组的分组
      if (!group.parentId) {
        const len = treeData.push({
          label: group.name,
          key: group._id
        });
        posArr[group._id] = [len - 1];
      } else {
        child.push(group);
        posArr[group._id] = [];
      }
    });

    getTreeData(child, treeData, posArr);
    return treeData;
  }
}

function getTreeData(child, treeData, posArr, level = 0) {
  // 后面会修改posArr数组的项，所以这里获取一份新的
  const newPosArr = posArr.slice(0);
  // 等待删除的数据下标
  const spliceDataIndex = [];
  child.forEach((c, i) => {
    // 获取到父分组的位置数组
    const pos = newPosArr[c.parentId];
    if (Array.isArray(pos) && pos.length > 0) {
      // 根据位置数组获取到children
      const childData = getChildren(treeData, pos, level);
      // 把数组添加进去
      const len = childData.push({
        label: c.name,
        key: c._id
      });
      // 更新当前项的位置数组
      posArr[c._id] = posArr[c._id].concat(pos, len - 1);
      spliceDataIndex.push(i);
    }
  });

  // 把child中的数组的下标在spliceDataIndex里面的项删除
  spliceDataIndex.forEach((val, i) => child.splice(val - i, 1));
  // 如果child还有数据，以及level小于8(防止一直执行下去)，说明还有分组没被分好
  if (child.length > 0 && level < 8) {
    getTreeData(child, treeData, posArr, ++level);
  }
}

function getChildren(data, pos, level) {
  let current = data;
  for (let i = 0; i <= level; i++) {
    if (!current[pos[i]].children) {
      current[pos[i]].children = [];
    }
    current = current[pos[i]].children;
  }
  return current;
}

export default getters
