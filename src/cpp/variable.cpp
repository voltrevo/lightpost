#include "frame.hpp"
#include "variable.hpp"

namespace lp {

item& variable::operator*() { return m_frame.variables[m_index]; }
const item& variable::operator*() const { return m_frame.variables[m_index]; }

item* variable::operator->() { &*this; }
const item* variable::operator->() const { &*this; }

void variable::assign(const item& value) { m_frame.variables[m_index] = value; }
variable& variable::operator=(const variable& v) { m_frame.variables[m_index] = v.m_frame.variables[v.m_index]; }

} // namespace lp
