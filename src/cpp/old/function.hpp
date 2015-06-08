#ifndef LP_FUNCTION_HPP
#define LP_FUNCTION_HPP

#include <cassert>

#include "item.hpp"

namespace lp {

class frame;

class function : public item
{
public:
    virtual std::string type() const { return "function"; }
    virtual double as_number() const { assert(false); return 0.0; }
    virtual std::string as_string() const { assert(false); return ""; }
    virtual void exec(frame&) const = 0;
    
    virtual bool is_variable() const { return false; }
    virtual void assign(const item&) { assert(false); }
};

} // namespace lp

#endif // LP_FUNCTION_HPP
