#ifndef LP_VARIABLE_HPP
#define LP_VARIABLE_HPP

#include <functional>

#include "boost/optional.hpp"

namespace lp {

class frame;
class item;

class variable
{
private:
    frame& m_frame;
    std::size_t m_index;

public:
    variable(frame& f, std::size_t index) : m_frame(f), m_index(index) { }
    item& operator*();
    const item& operator*() const;
    item* operator->();
    const item* operator->() const;

    void assign(const item& value);
    variable& operator=(const variable& v);
};

} // namespace lp

#endif // LP_VARIABLE_HPP
