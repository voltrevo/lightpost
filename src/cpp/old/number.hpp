#ifndef LP_NUMBER_HPP
#define LP_NUMBER_HPP

#include <cassert>

#include "item.hpp"

namespace lp {

class frame;

class number : public item
{
private:
    double m_value;

public:
    number(double value) : m_value(value) { }
    
    virtual std::string type() const { return "number"; }
    virtual double as_number() const { return m_value; }
    virtual std::string as_string() const { assert(false); return ""; }
    virtual void exec(frame&) const { assert(false); }

    virtual bool is_variable() const { return false; }
    virtual void assign(const item&) { assert(false); }
};

} // namespace lp

#endif // LP_NUMBER_HPP
