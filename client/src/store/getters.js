/**
 * getter
 */

import groups2Tree from '@/util/groups2Tree';

const getters = {
  groupsTreeData: state => groups2Tree(state.groups),
  treeGroups: (state, getters) => getters.groupsTreeData.treeData,
  posCollection: (state, getters) => getters.groupsTreeData.posCollection,
  unusedGroup: (state, getters) => getters.groupsTreeData.unusedGroup
}

export default getters
