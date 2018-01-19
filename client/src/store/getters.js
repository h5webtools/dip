/**
 * getter
 */

import groups2Tree from '@/util/groups2Tree';

const getters = {
  treeGroups: state => groups2Tree(state.groups)
}

export default getters
