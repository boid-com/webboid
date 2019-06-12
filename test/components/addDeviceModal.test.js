import { mount, createLocalVue } from '@vue/test-utils'
import addDeviceModal from '../../src/components/addDeviceModal.vue'
import Quasar, { QBtn, QIcon,OpenUrl }from 'quasar'

describe('Render, build and wire up a Footer Component', () => {
  const localVue = createLocalVue();
  localVue.use( Quasar, { components:['QBtn', 'QIcon', 'OpenUrl']});
  const wrapper = mount(addDeviceModal, {
    localVue
  });
  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
