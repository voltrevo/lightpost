#ifndef LP_STRING_HPP
#define LP_STRING_HPP

#include <algorithm>
#include <cassert>

#include "item.hpp"

namespace lp {

class frame;

class string : public item
{
private:
    std::string m_value;

public:
    string(std::string value) : m_value(std::move(value)) { }
    
    virtual std::string type() const { return "string"; }
    virtual double as_number() const { assert(false); return 0.0; }
    virtual std::string as_string() const { return m_value; }
    virtual void exec(frame&) const { assert(false); }
    
    virtual bool is_variable() const { return false; }
    virtual void assign(const item&) { assert(false); }
};

} // namespace lp

#endif // LP_STRING_HPP
