import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Edit2, Trash2, UserPlus } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { adminService, CreateUserData, UpdateUserData } from '../../services/admin.service'

interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  role: string
  emailVerified: boolean
  createdAt: string
  _count?: {
    hostedEvents: number
    attendedEvents: number
  }
}

export default function AdminUsers() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [page, setPage] = useState(1)
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  const [createFormData, setCreateFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'USER',
  })
  
  const [editFormData, setEditFormData] = useState<UpdateUserData>({
    email: '',
    fullName: '',
    phone: '',
    role: 'USER',
  })

  // Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', selectedRole, searchQuery, page],
    queryFn: () => adminService.getUsers({
      role: selectedRole !== 'all' ? selectedRole : undefined,
      search: searchQuery || undefined,
      page,
      limit: 10,
    }),
  })

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsCreateModalOpen(false)
      setCreateFormData({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'USER',
      })
      alert('User created successfully!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create user')
    },
  })

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsEditModalOpen(false)
      setSelectedUser(null)
      alert('User updated successfully!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update user')
    },
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      alert('User deleted successfully!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete user')
    },
  })

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role as any,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(createFormData)
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUser) {
      updateMutation.mutate({
        id: selectedUser.id,
        data: editFormData,
      })
    }
  }

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id)
    }
  }

  const users = data?.data?.users || []
  const pagination = data?.data?.pagination

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus size={20} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Roles</option>
              <option value="USER">Users</option>
              <option value="HOST">Hosts</option>
              <option value="VENDOR">Vendors</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">Error loading users</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'HOST' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'VENDOR' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user._count && (
                          <div className="space-y-1">
                            <div>Events: {user._count.hostedEvents + user._count.attendedEvents}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} users
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={createFormData.fullName}
            onChange={(e) => setCreateFormData({ ...createFormData, fullName: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={createFormData.email}
            onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
            required
          />
          <Input
            label="Phone (Optional)"
            value={createFormData.phone}
            onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={createFormData.password}
            onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
            helperText="Minimum 8 characters"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={createFormData.role}
              onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="USER">User</option>
              <option value="HOST">Host</option>
              <option value="VENDOR">Vendor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="lg"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={editFormData.fullName}
            onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            required
          />
          <Input
            label="Phone (Optional)"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={editFormData.role}
              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="USER">User</option>
              <option value="HOST">Host</option>
              <option value="VENDOR">Vendor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedUser?.fullName}</strong>? This action cannot be undone and will delete all associated data.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
              isLoading={deleteMutation.isPending}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}