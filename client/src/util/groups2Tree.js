/**
 * groups转换成tree数据结构
 */

function groups2Tree(groups) {
  let treeData = [];
  let posCollection = {}; // 位置集合
  let child = []; // 子分组

  groups.forEach((group) => {
    // 没有父分组的分组
    if (!group.parentId) {
      const len = treeData.push({
        label: group.name,
        key: group._id
      });
      posCollection[group._id] = [len - 1];
    } else {
      child.push(group);
      posCollection[group._id] = [];
    }
  });

  getTreeData(child, treeData, posCollection);
  return {
    treeData,
    posCollection,
    unusedGroup: child.map(g => ({ label: g.name, key: g._id }))
  };
}

function getTreeData(child, treeData, posCollection, level = 0) {
  // 后面会修改posArr数组的项，所以这里获取一份新的
  const newPosCollection = assign(posCollection, {});
  // 等待删除的数据下标
  const spliceDataIndex = [];
  child.forEach((c, i) => {
    // 获取到父分组的位置数组
    const pos = newPosCollection[c.parentId];
    if (Array.isArray(pos) && pos.length > 0) {
      // 根据位置数组获取到children
      const childData = getChildren(treeData, pos, level);
      // 把数组添加进去
      const len = childData.push({
        label: c.name,
        key: c._id
      });
      // 更新当前项的位置数组
      posCollection[c._id] = posCollection[c._id].concat(pos, len - 1);
      spliceDataIndex.push(i);
    }
  });

  // 把child中的数组的下标在spliceDataIndex里面的项删除
  spliceDataIndex.forEach((val, i) => child.splice(val - i, 1));
  // 如果child还有数据，以及level小于8(防止一直执行下去)，说明还有分组没被分好
  if (child.length > 0 && level < 8) {
    getTreeData(child, treeData, posCollection, ++level);
  }
}

function assign(from, to) {
  for (let k in from) {
    to[k] = from[k];
  }
  return to;
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

export default groups2Tree;
